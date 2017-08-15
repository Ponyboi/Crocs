wifi.setmode(wifi.STATIONAP)
-- wifi.sta.config("ubik1","cervicalspine")
-- wifi.sta.config("Caterpillar","coolbreeze")
wifi.sta.config("FoxFi16","Welcome123!")
wifi.sta.connect()
-- host = "ws://dinodemcu.herokuapp.com/80/"
host = "ws://192.168.43.35:8080/"
_G.printComments = false
_G.printLine = function (data)
    local doPrint = _G.printComments
    if (doPrint) then
        print(data)
    end
end

function abortInit()
    -- initailize abort boolean flag
    abort = false
    print('Press ENTER to abort startup')
    -- if <CR> is pressed, call abortTest
    uart.on('data', '\r', abortTest, 0)
    -- start timer to execute startup function in 5 seconds
    tmr.alarm(0,5000,0,startup)
    end
    
function abortTest(data)
    -- user requested abort
    abort = true
    -- turns off uart scanning
    uart.on('data')
    end

function startup()
    -- uart.on('data')
    -- end   -- if user requested abort, exit

    if abort == true then
        print('startup aborted')
        return
        end

    -- otherwise, start up
    print('in startup')
    --dofile('dino.lua')

    timer = 0
    perc = 0
    timeDelta = 0
    timeDeltaOld = 0
    wait = 1000
    buttonState = false
    buttonOldState = 0
    inputState = false
    radius = 50
    state = "move"
    xOffset = 200
    yOffset = 200

    clientRef = {}

    tmr.alarm(0, 3000, 1, function ()
      local ip = wifi.sta.getip()
      if ip then
        tmr.stop(0)
        print("IP: "..ip..", memory: "..node.heap())
        st = node.heap()

        dofile("ws_client.lua")
        print("Loading ws sources takes "..(st - node.heap()).." bytes")

        -- configure ws client
        local ws_client = websocket.createClient()

        -- on established connection, after handshacking - good point to introduce your self
        ws_client.on_connected = function (client, data)
            clientRef = client
            print("Sending board metadata")
            client:send('{ "state": "start", "x": 0, "y": 0 }')

            tmr.alarm(1, 100, 1, function ()
                state = "move"

                pinState = gpio.read(3)
                -- print('pinState '.. pinState)
                -- print('buttonOldState '.. buttonOldState)
                -- print('buttonState '.. tostring(buttonState))
                if (buttonOldState ~= pinState) then
                    if (pinState == 0) then
                        print('buttonState change')
                        print('buttonState '.. tostring(buttonState))
                        state = "start"
                        buttonState = not buttonState
                        ws_client.on_sent(clientRef, "{}")
                    end
                    buttonOldState = pinState
                end
                -- if (buttonState) then
                --     ws_client.on_sent(clientRef, "{}")
                -- end
            end)
        end

        ws_client.on_sent = function (client, data)
            -- Possibly a bad idea to save client var
            clientRef = client

            timeDelta = tmr.now() - timeDeltaOld
            -- print(timeDelta)
            -- if (timeDelta > wait) then
                --print("Sending update")
                _G.printLine("Sending update")

                t = tmr.now() / 100000
                if (inputState) then
                    x = radius + xOffset
                    y = 0 + yOffset
                    inputState = not inputState
                else
                    x = -radius + xOffset
                    y = 0 + yOffset
                    inputState = not inputState
                end

                -- x = math.cos(t)
                -- y = math.sin(t)
                command = '{ "state": "'..state..'", "x": '..x..', "y":'..y..' }'
                -- _G.printLine(command)
                    -- tmr.delay(wait)
                _G.printLine('waitover')
                _G.printLine(tostring(buttonState))
                if (buttonState) then
                    print(command)
                    client:send(command)
                    print("done")
                end
                timeDeltaOld = tmr.now()
            -- end
        end

        -- you can ping server and process on pong
        ws_client.on_pong = function (client, data)
            print("PONG! data"..tostring(data))
        end

        -- receiving messages after connection
        ws_client.on_receive = function (client, data)
            _G.printLine("RECEIVED, data "..tostring(data).."!")
            if data=="Go-go-go" then
                client:send('{"data": "value"}')
            end
        end

        -- catch event of closing - good point to reconnect
        ws_client.on_close = function (client, data)
            print("CLOSE, socket: "..tostring(client.socket)..", data "..tostring(data).."!")
            tmr.delay(5000000)      -- delay a little bit before reconnecting
            client:reconnect()
        end

        -- to start connection you need just to set full url, client take care about its parsing
        ws_client:connect(host)

      end
    end)
    end

tmr.alarm(0,1000,0,abortInit)
