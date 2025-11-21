import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
  logging: false,
  extra: {
    connectionLimit: 10, // batas koneksi di pool
    waitForConnections: true, // kalau pool penuh, tunggu bukan error
    enableKeepAlive: true, // aktifkan TCP keepalive
    keepAliveInitialDelay: 10000, // delay keepalive (ms)
  },
};
