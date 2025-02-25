import ky from 'ky';

const KyClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_POKEMON_API,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default KyClient;
