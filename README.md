# armswarm

To start the manager :

```bash
docker run -d --name swarm-manager --privileged --restart=always -v /var/run/docker.sock:/var/run/docker.sock -p 1194:1194/udp swarm-manager
```

To start the agent :

```bash
docker run -d --name swarm-agent --privileged --restart=always -v /var/run/docker.sock:/var/run/docker.sock swarm-agent
```
