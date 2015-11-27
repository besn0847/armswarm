#!/bin/ash

iptables -t nat -A POSTROUTING -s 172.20.0.0/16 -o eth0 -j MASQUERADE

/usr/sbin/openvpn --config /etc/openvpn/udp1194.conf

