# armswarm

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
