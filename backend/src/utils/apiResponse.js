export function ok(res, data, meta) {
  return res.status(200).json({ data, meta });
}

export function created(res, data) {
  return res.status(201).json({ data });
}

export function badRequest(res, message) {
  return res.status(400).json({ message });
}


