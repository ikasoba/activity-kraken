import { fetchForProxy } from "./fetch.ts";

export const startProxy = async (url: URL, req: Request) => {
  const upgrade = req.headers.get("upgrade");

  if (upgrade == "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    const hostSocket = new WebSocket(url);

    await Promise.all([
      new Promise<void>((resolve) => {
        socket.addEventListener("open", () => {
          resolve();
        });
      }),
      new Promise<void>((resolve) => {
        hostSocket.addEventListener("open", () => {
          resolve();
        });
      }),
    ]);

    hostSocket.addEventListener("close", () => {
      socket.close();
    });

    hostSocket.addEventListener("message", (e) => {
      if (socket.readyState == WebSocket.OPEN) socket.send(e.data);
    });

    socket.addEventListener("close", () => {
      hostSocket.close();
    });

    socket.addEventListener("message", (e) => {
      if (hostSocket.readyState == WebSocket.OPEN) hostSocket.send(e.data);
    });

    return response;
  }

  return fetchForProxy(url, req);
};
