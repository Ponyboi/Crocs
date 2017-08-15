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

-- Setup I/O pins --
pwm.setup(ledPin, 100, 512)
pwm.start(ledPin)
pwm.setup(4, 1000, 0)
pwm.start(4)
pwm.setup(3, 1000, 0)
pwm.start(3)
pwm.setup(1, 1000, 0)
pwm.start(1)
pwm.setup(9, 1000, 0)
pwm.start(9)
pwm.setup(2, 1000, 0)
pwm.start(2)

gpio.mode(5, gpio.OUTPUT)
 
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
  pwm.setduty(1, val)
  pwm.setduty(9, val)
  pwm.setduty(2, val)


  end
 -- end
 
function setPWMs(val)
  pwm.setduty(4, val)
  pwm.setduty(3, val)
  pwm.setduty(1, val)
  pwm.setduty(9, val)
  pwm.setduty(2, val)
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
    if (gpio(5) == )
      setPWMs(data.x);

  end)

-- tmr.alarm(1, 5, 1, function()
--   -- print('check_wifi..')
--     check_wifi()
--   end)
