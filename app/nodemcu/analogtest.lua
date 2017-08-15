joystick_xmax = 1023;
joystick_xmult = 1;
joystick_ymax = 1023;
joystick_ymult = 1;
-- gpio.mode(6, gpio.OUTPUT)
-- gpio.mode(7, gpio.OUTPUT)



function get_joystick_x()
  gpio.mode(7, gpio.INPUT)
  gpio.mode(6, gpio.OUTPUT)
  gpio.write(6,gpio.LOW)
  return math.max(0, math.min(1023,((joystick_xmax-adc.read(0))*joystick_xmult)))
end

function get_joystick_y()
  gpio.mode(6, gpio.INPUT)
  gpio.mode(7, gpio.OUTPUT)
  gpio.write(7,gpio.LOW)
  return math.max(0, math.min(1023,((joystick_ymax-adc.read(0))*joystick_ymult)))
end

function printCoordsLoop()
  tmr.alarm(1, 200, 1, function() 
    x = get_joystick_x()
    y = get_joystick_y()
    print(x .. ', ' .. y)
  end)
end

function fmod(a, b)
  return a - math.floor(a/b)*b
end

function calibrate()
  local cnt = 0;
  local xmax = 0;
  local xmin = 1023;
  local ymax = 0;
  local ymin = 1023;
  tmr.alarm(0, 100, 1, function()
    jx = joystick_xmax-get_joystick_x() * -1
    jy = joystick_ymax-get_joystick_y() * -1
    print(jx .. ', ' .. jy .. cnt)
    if((fmod(cnt,2) == 0) and jx < 450) then
      cnt = cnt + 1
    end
    if((fmod(cnt,2) == 1) and jx > 800) then
      cnt = cnt + 1
    end
    xmax = math.max(xmax, jx)
    xmin = math.min(xmin, jx)
    ymax = math.max(ymax, jy)
    ymin = math.min(ymin, jy)

    if ( cnt >= 4) then
      tmr.stop(0)
      printCoordsLoop()
    end
  end)
  joystick_xmax = xmax
  joystick_xmult = 1023/(xmax - xmin)
  joystick_ymax = ymax
  joystick_ymult = 1023/(ymax - ymin)
end

calibrate()