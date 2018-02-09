@echo off
netsh http delete urlacl url=http://127.0.0.1:80/
netsh http add urlacl url=http://127.0.0.1:80/ user=everyone
regsvr32 \\172.16.54.8\softphone\AgentPannel.ocx
