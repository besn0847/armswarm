# ArmSwarm

Refer to this blog post to understand the why : http://besn0847.blogspot.com/2015/11/building-internet-wide-container.html

Please note this requires your host to have Docker 1.9.0 installed.

First you need to generate new OpenVpn keys specific to your deployment. Refer to this project from Jérôme to get hold of them : https://github.com/jpetazzo/dockvpn.
You should get the following files : cert.pem, csr.pem, dh.pem, key.pem & client.ovpn.

Then clone this repo since you will need to rebuild the manager and agents :

```bash
git clone https://github.com/besn0847/armswarm.git
```

Copy the files collected above to the right directories : 
- All but client.ovpn go to armswarm/server/etc/openvpn
- Client.ovpn goes to armswarm/[arm|x86]/etc/openvpn/docker.ovpn
 
Adjust the OpenVpn @IP in docker.ovpn files.

Ready to build the containers on target hosts
```bash
 docker build -t swarm-manager .
 docker build -t swarm-agent .
```
To start the manager :

```bash
docker run -ti -d --restart=always --name shipyard-rethinkdb rethinkdb
docker run -d --privileged --name swarm-manager --restart=always --link shipyard-rethinkdb:rethinkdb -p 1194:1194/udp -p 23760:23760 -p 8080:8080 -v /var/run/docker.sock:/var/run/docker.sock swarm-manager
```

To start the agent :

```bash
docker network create mgmt
docker run -d --name swarm-agent --privileged --restart=always --net=mgmt -v /var/run/docker.sock:/var/run/docker.sock swarm-agent
```
