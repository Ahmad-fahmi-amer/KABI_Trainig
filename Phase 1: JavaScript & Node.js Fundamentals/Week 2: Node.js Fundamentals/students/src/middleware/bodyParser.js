export function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) return resolve({});

      resolve(JSON.parse(body));
    });

    req.on("error", reject);
  });
}
