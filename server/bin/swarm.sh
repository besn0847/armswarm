#!/bin/ash

/bin/swarm join --addr=`ip addr show tun1194 | grep inet | awk '{print $2}'`:23750 $*
