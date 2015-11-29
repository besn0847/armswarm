#!/bin/ash

while(true)
do
   sleep 60 

   SWARMIP=`ps -ef | grep join | grep -v grep |  awk '{print$6}' - | awk -F"=" '{print$2}' - | awk -F":" '{print$1}'`
   CURRENTIP=`ip addr show tun0 | grep inet | awk '{print $2}'`

   if [ $SWARMIP != $CURRENTIP ]
   then
      echo `date`" : @IP misalignement, restarting Swarm agent"
      kill `ps -ef | grep join | grep -v grep |  awk '{print$1}' -` 
   fi
done
