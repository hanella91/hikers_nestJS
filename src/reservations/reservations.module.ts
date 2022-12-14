import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '../events/events.module';
import { EventsService } from '../events/events.service';
import { Reservation } from './entity/reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), EventsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, EventsService],
  exports : [TypeOrmModule]
})
export class ReservationsModule { }
