export function success(res, data) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data));
}

export function created(res, data) {
  res.writeHead(201, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data));
}

export function noContent(res) {
  res.writeHead(204);

  res.end();
}

export function error(res, status, message) {
  res.writeHead(status, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      message,
    }),
  );
}
