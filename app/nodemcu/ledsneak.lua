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
triggerPin = 2
oldState = 0
state = 0
timeDelta = tmr.now()
timeDeltaOld = tmr.now()
timer = 0

-- gpio.mode(12,gpio.OUTPUT)
-- gpio.mode(8,gpio.OUTPUT)
gpio.mode(2,gpio.INPUT)
-- gpio.mode(1,gpio.OUTPUT)

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
 
function foo()
  gpio.mode(2,gpio.OUTPUT)
  gpio.mode(2,gpio.INPUT)
  timeDelta = tmr.now() - timeDeltaOld
  timeDeltaOld = tmr.now()
  state = gpio.read(2)
  print(state)

  if (state == 1) then
    timer = timer + timeDelta
    print(timer)
  end

  if (timer > 4000000 and timer < 5000000) then
    setPWMs(0)
    print('abs off')
  end

  if (timer > 1000000 and timer < 2000000) then
    setPWMs(1020)
    print('abs on')
  end

  if (state ~= oldState) then
    if (state == 1) then
      -- setPWMs(1020)
      timer = 0;
      oldState = state
    else
      setPWMs(0)
      oldState = state
    end
  end
end

function setPWMs(val)
  pwm.setduty(3, val)
  pwm.setduty(4, val)
  pwm.setduty(6, val)
  pwm.setduty(7, val)
  pwm.setduty(5, val)
  pwm.setduty(8, val)
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

tmr.alarm(1, 200, 1, function()
  print('connecting..')
    foo()
  end)
setPWMs(0)

-- tmr.alarm(1, 5, 1, function()
--   -- print('check_wifi..')
--     check_wifi()
--   end)
