-- stepper.lua
host = 'ws://192.168.43.35:8080'


-- simple stepper driver for controlling a stepper motor with a
-- l293d driver

-- esp-12 pins:  16 14 12 13 
-- nodemcu pins:  0  5  6  7
dir = 1
stepper_pins = {0,5,6,7}
-- half or full stepping
step_states4 = {
 {1,0,0,1},
 {1,1,0,0},
 {0,1,1,0},
 {0,0,1,1}
}
step_states8 = {
 {1,0,0,0},
 {1,1,0,0},
 {0,1,0,0},
 {0,1,1,0},
 {0,0,1,0},
 {0,0,1,1},
 {0,0,0,1},
 {1,0,0,1},
}
step_states = step_states8 -- choose stepping mode
step_numstates = 8 -- change to match number of rows in step_states
step_delay = 20 -- choose speed
step_state = 0 -- updated by step_take-function
step_direction = 1 -- choose step direction -1, 1
step_stepsleft = 0 -- number of steps to move, will de decremented
step_timerid = 4 -- which timer to use for the steps

-- setup pins
for i = 1, 4, 1 do
  gpio.mode(stepper_pins[i],gpio.OUTPUT)
end

-- setup websocket connection
local ws = websocket.createClient()
ws:on("connection", function(ws)
  print('got ws connection')
end)
ws:on("receive", function(_, c, opcode)
  print('got message:', c, opcode) -- opcode is 1 for text message, 2 for binary
  local index = trimJSON(c)
    print(index)
    if (index ~= -1) then
      c = c:sub(0, index)
      data = cjson.decode(c)
    -- print(data);

      if (data.type == "WELCOME") then
        print(data.message)
      elseif (data.type == "TOGGLE") then
        toggle()
        end
      end
end)
ws:on("close", function(_, status)
  print('connection closed', status)
  ws = nil -- required to lua gc the websocket client
end)

ws:connect(host)

function toggle() 
  state = not state
  if (state) then
    tmr.alarm(0,5000,tmr.ALARM_AUTO,test_stepper)
  else
    tmr.unregister()
  end
end

-- stepper logic
-- turn off all pins to let motor rest
function step_stopstate() 
  for i = 1, 4, 1 do
    gpio.write(stepper_pins[i], 0)
  end
end

-- make stepper take one step
function step_take()

  -- jump to the next state in the direction, wrap
  step_state = step_state + step_direction
  if step_state > step_numstates then
    step_state = 1;
  elseif step_state < 1 then
    step_state = step_numstates
  end

  --print("step " .. step_state)
  -- write the current state to the pins
  for i = 1, 4, 1 do
    gpio.write(stepper_pins[i], step_states[step_state][i])
  end

  -- might take another step after step_delay
  step_stepsleft = step_stepsleft-1
  if step_stepsleft > 0 then
    tmr.alarm(step_timerid, step_delay, 0, step_take )
  else
    step_stopstate()
  end
end

-- public method to start moving number of 'int steps' in 'int direction'
function step_move(steps, direction, delay)
  tmr.stop(step_timerid)
  step_stepsleft = steps
  step_direction = direction
  step_delay = delay
  step_take()
end

-- public method to cancel moving
function step_stop()
  tmr.stop(step_timerid)
  step_stepsleft = 0
  step_stopstate()
end
-- step_move(8,(1),20)
-- step_move(8,(-1),20)
function test_stepper()
  print('step move')
  dir = -1 * dir
  step_move(140,(dir),6)
end


--step_move(8,(1),20)-- stepper.lua -- simple stepper driver for controlling a stepper motor with a -- l293d driver -- esp-12 pins:  16 14 12 13 -- nodemcu pins:  0  5  6  7 stepper_pins = {0,5,6,7} -- half or full stepping step_states4 = {  {1,0,0,1},  {1,1,0,0},  {0,1,1,0},  {0,0,1,1} } step_states8 = {  {1,0,0,0},  {1,1,0,0},  {0,1,0,0},  {0,1,1,0},  {0,0,1,0},  {0,0,1,1},  {0,0,0,1},  {1,0,0,1}, } step_states = step_states8 -- choose stepping mode step_numstates = 8 -- change to match number of rows in step_states step_delay = 20 -- choose speed step_state = 0 -- updated by step_take-function step_direction = 1 -- choose step direction -1, 1 step_stepsleft = 0 -- number of steps to move, will de decremented step_timerid = 4 -- which timer to use for the steps -- setup pins for i = 1, 4, 1 do   gpio.mode(stepper_pins[i],gpio.OUTPUT) end -- turn off all pins to let motor rest function step_stopstate()   for i = 1, 4, 1 do     gpio.write(stepper_pins[i], 0)   end end -- make stepper take one step function step_take()   -- jump to the next state in the direction, wrap   step_state = step_state + step_direction   if step_state > step_numstates then     step_state = 1;   elseif step_state < 1 then     step_state = step_numstates   end   --print("step " .. step_state)   -- write the current state to the pins   for i = 1, 4, 1 do     gpio.write(stepper_pins[i], step_states[step_state][i])   end   -- might take another step after step_delay   step_stepsleft = step_stepsleft-1   if step_stepsleft > 0 then     tmr.alarm(step_timerid, step_delay, 0, step_take )   else     step_stopstate()   end end -- public method to start moving number of 'int steps' in 'int direction' function step_move(steps, direction, delay)   tmr.stop(step_timerid)   step_stepsleft = steps   step_direction = direction   step_delay = delay   step_take() end -- public method to cancel moving function step_stop()   tmr.stop(step_timerid)   step_stepsleft = 0   step_stopstate() end --step_move(8,(1),20)