## Frontend and Backend Socket Communication

```
+-----------------+  ⬇ (emit "playCard")  +-----------------+  ⬇ (validate turn) 
| Frontend Player |  --------------------> |  Backend Server | --------------------+  ➡ playCard()
+-----------------+                        +-----------------+                     |
                                                                                   |  ➡ update currentTurn                  
                                                                                   |
                                                                                   |  ⬇ (emit "gameStateUpdate")
                                        +----------------------+    ⬇ (receive)   |
                                        | Frontend All Players | <-----------------+
                                        +----------------------+   ➡ If socket.id === currentTurn => can play
``` 






