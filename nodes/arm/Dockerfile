FROM hypriot/rpi-alpine-scratch

RUN apk update && \
	apk add openvpn socat supervisor

ADD ./bin/swarm /bin/
ADD ./bin/swarm.sh /bin/
ADD ./etc/openvpn/docker.ovpn /etc/openvpn/
ADD ./etc/ssl/ /etc/ssl/
ADD ./etc/supervisor.d/agent.ini /etc/supervisor.d/

CMD /usr/bin/supervisord --nodaemon --configuration /etc/supervisord.conf  
