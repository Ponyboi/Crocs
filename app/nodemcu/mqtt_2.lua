wifi.setmode(wifi.STATION)
wifi.sta.config("Caterpillar","coolbreeze")
port = 13711
host = "m11.cloudmqtt.com"

timer = 0
perc = 0
timeDelta = 0
timeDeltaOld = 0

function setPlayer (pData)
  print('p')
  pTime = pData.time + pData.timeSync
  pDuration = pData.songLength
  pState = pData.state
end

function setAutomation (aData)
  a = aData.points
  aSize = aData.size
end

function playAutomation ()
    timeDelta = tmr.now() - timeDeltaOld
    timeDeltaOld = tmr.now()

  if (pState == 'play' and pOldState ~= 'play') then
    if (pOldState == 'stop') then
      timer = 0
    elseif (pOldState == 'pause') then
      timer = pTime * 1000
    end
    pOldState = 'play'
  elseif (pState == 'pause' and pOldState ~= 'pause') then
    pOldState = 'pause'
    pauseTime = tmr.now()
  end

  if (timer > pDuration * 1000) then
    timer = timer - (pDuration * 1000)
  end

  if (pState == 'play') then
    timer = timer + timeDelta
    perc = (timer * 10)/ pDuration
  end

  if (aSize ~= nil and a ~= nil) then
    for i=1,aSize-1 do
      if (a[i+1].x >= perc or (a[i].x > perc and a[i+1].x > perc)) then
        autoDiff = a[i+1].x - a[i].x
        point1y = ((((a[i+1].x - perc) * 1000) / autoDiff) * a[i].y) / 1000
        point2y = ((((perc - a[i].x) * 1000) / autoDiff) * a[i+1].y) / 1000
        point = (point1y + point2y)/10
        print(point)
        break
      end
    end
  end
  print(timer)
end

m = mqtt.Client("ESP8266_"..node.chipid(), 120, "lihodckw", "xsljW_4eHDBO")
m:lwt("switch1", "false", 1, 1)

m:on("offline", function(con)
  print ("reconectando...") 
  tmr.alarm(1, 10000, 0, function()
  m:connect(host, port, 0)
  end)
end)

m:on("message", function(conn, topic, data) 
  print(topic .. ":" ..data ) 
  if data ~= nil then
    if (topic == 'player') then
      setPlayer(cjson.decode(data))
    elseif(topic == 'automation') then
      setAutomation(cjson.decode(data))
    end
  end
end)

tmr.alarm(0, 1000, 1, function()
  print('connecting..')
  if wifi.sta.status() == 5 then
    tmr.stop(0)
    m:connect(host, port, 0, function(conn)
      m:subscribe({["switch1"]=0,["automation"]=1,["player"]=2}, 0, function(conn) print("Subcripcion ok switch1")
      end)
      tmr.alarm(0, 300, 1, function()
        playAutomation()
      end)
    end)
  end
end)