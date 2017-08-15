wifi.setmode(wifi.STATION)
wifi.sta.config("FoxFi16","Welcome123!")
-- wifi.sta.config("Caterpillar","coolbreeze")
-- port = 13711
-- host = "dinodemcu.herokuapp.com"
host = "192.168.43.35"
isConnected = false;

counter = 0
local counter2 = 0
local dir = true;
 
-- I/O Pin constants --
switchPin = 3
ledPin = 5

-- gpio.mode(12,gpio.OUTPUT)
gpio.mode(8,gpio.OUTPUT)

-- Setup I/O pins --
pwm.setup(ledPin, 100, 512)
pwm.start(ledPin)
pwm.setup(4, 1000, 0)
pwm.start(4)
pwm.setup(3, 1000, 0)
pwm.start(3)
pwm.setup(6, 1000, 0)
pwm.start(6)
pwm.setup(7, 1000, 0)
pwm.start(7)
pwm.setup(5, 1000, 0)
pwm.start(5)

-- GPIO ID
-- 0     3  
-- 1     10
-- 2     4  
-- 3     9  
-- 4     2 #5
-- 5     1 #4
-- 12    6
-- 13    7
-- 14    5
-- 15    8
-- 16    0

-- gpio.mode(12,gpio.OUTPUT)
-- gpio.mode(6,gpio.OUTPUT)
 
local buttonRelease = 1
 
function check_wifi()
 -- local ip = wifi.sta.getip()
 
 -- if(ip==nil) then
   --print("Connecting...")
 -- else
  ---
  -- local analog = adc.read(0)

  if (dir and counter2 < 100) then
    counter2 = counter2 + 1
  elseif (dir and counter2 >= 100) then
    dir = false
    counter2 = counter2 -5
  elseif (not dir and counter2 >= 1) then
    counter2 = counter2 -1
  elseif (not dir and counter2 <= 1) then
    dir = true
    counter2 = counter2 + 5
  end

  local val = counter2 * 10
  -- val = 0
  -- print(val)

  pwm.setduty(4, val)
  pwm.setduty(3, val)
  pwm.setduty(6, val)
  pwm.setduty(7, val)
  pwm.setduty(5, val)


  end
 -- end
 
 
function foo()
  print('in foo')
  conn = net.createConnection(net.TCP, 0)
  conn:on("sent", function()
    --   tmr.delay(100000);
    --   x = get_joystick_x()
    --   y = get_joystick_y()
    --   conn:send('{ "state": "move", "x":' .. x .. '", "y":' .. y .. '"}')
    end)
  conn:on("connection", function() 
    print("init connection")
    conn:send('{"type": "signature", "signature": "LED"}')
    -- conn:close()
    end)
  conn:on("receive", function (sk, c)
    if (not isConnected) then
      isConnected = true
    end
    print(c)
    index = string.find(c, "{[^{]*$")
    print(index)
    length = string.len(c)
    if (index ~= nil) then
      c = string.sub(c, index, length)
      end
    local index = trimJSON(c)
    print(index)
    if (index ~= -1) then
      c = c:sub(0, index)
      data = cjson.decode(c)

      if (data.type == "welcome") then
        print(data.message)
        end
      
      if (data.type == "controller") then
        print(data.x)
        -- leds
        if (data.state == "LED") then
          setLED(tonumber(data.r), tonumber(data.g), tonumber(data.b))
          end
        -- motors
        -- if (data.state == "motor") then
        --   if (data.command == "MoveUpMouseDown") then
        --     setMotorUp(1000)
        --   else if (data.command == "MoveUpMouseUp") then
        --     setMotorUp(0)
        --   else if (data.command == "MoveDownMouseDown") then
        --     setMotorUp(1000)
        --   else if (data.command == "MoveDownMouseUp") then
        --     setMotorUp(0)
        --     end
        --   end
        end
      end
    end)
  conn:connect(8081, host)
  end

function setPWMs(val)
  pwm.setduty(3, val)
  pwm.setduty(4, val)
  pwm.setduty(6, val)
  pwm.setduty(7, val)
  pwm.setduty(5, val)
  pwm.setduty(8, b)
end

function setMotorUp(val)
  pwm.setduty(3, val)
end

function setMotorDown(val)
  pwm.setduty(4, val)
end

function setLED(r,g,b)
  pwm.setduty(6, r)
  pwm.setduty(7, g)
  pwm.setduty(8, b)
end

function trimJSON(input)
  local left = 0
  local right = 0
  local index = -1
  for i = 1, #input do
    local c = input:sub(i,i)
      if (c == '{') then
        left = left + 1
      elseif (c == '}') then
        right = right +1
      end
      if (left == right) then
        index = i
        break
      end
  end
  return index
end

tmr.alarm(1, 1000, 1, function()
  print('connecting..')
  if wifi.sta.status() == 5 then
    tmr.stop(1)

    if (not isConnected) then
      tmr.alarm(1, 1000, 1, function()
        if (not isConnected) then
          foo()
        else
          tmr.stop(1)
          end
        end)
      end

    end
  end)

-- tmr.alarm(1, 5, 1, function()
--   -- print('check_wifi..')
--     check_wifi()
--   end)
