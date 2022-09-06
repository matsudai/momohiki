export const digestSHA512 = async (data: Parameters<typeof crypto['subtle']['digest']>[1]) => {
  const hashBytes = new Uint8Array(await crypto.subtle.digest('SHA-512', data));
  let hash = '';
  for (let i = 0; i < hashBytes.length; ++i) {
    hash += hashBytes[i].toString(16).padStart(2, '0');
  }
  return hash;
};
