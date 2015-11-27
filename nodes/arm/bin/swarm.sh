#!/bin/ash

/bin/swarm join --addr=`ip addr show tun0 | grep inet | awk '{print $2}'`:23750 $*
