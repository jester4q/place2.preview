import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../core/database/database.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { UsersModule } from './modules/users/users.module';
// import { ElasticLoggerModule } from './core/elasticLogger/elasticLogger.module';
// import { NatsModule } from './core/nats/nats.module';
import { ObjectsModule } from './objects/objects.module';
import { FilesModule } from './files/files.module';
import { ArticlesModule } from './articles/articles.module';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ElasticLoggerModule,
    // NatsModule,
    DatabaseModule,
    //AuthModule,
    //UsersModule,
    ObjectsModule,
    ArticlesModule,
    FilesModule,
    CitiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
