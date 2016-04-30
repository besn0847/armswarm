#!/bin/ash

/bin/swarm -l "warn" join --addr=`ip addr show tun0 | grep inet | awk '{print $2}' | egrep -v '[a-z]'`:23750 $*
