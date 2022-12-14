import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import e from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService } from '../events/events.service';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entity/reservation.entity';
import { ReservationsService } from './reservations.service';

@Controller('events/:id/reservations')
export class ReservationsController {
  constructor(
    private reservationService: ReservationsService,
    private eventService: EventsService,
  ) { }

  @Post()
  async create(@Request() req, @Param('id') eventId: string): Promise<Reservation> {
    console.log('hehe')
    const requestUser = req.user.userId
    return await this.reservationService.create(requestUser, eventId);
  }

  @Get()
  async findAll(@Param('id') eventId: string): Promise<Reservation[]> {
    return await this.reservationService.findAll(eventId);
  }

  @Get(':reservation_id')
  async findOne(@Param('reservation_id') id: string): Promise<Reservation | null> {
    const reservation = await this.reservationService.findOne(id);
    if (null === reservation) {
      throw new HttpException(`reservation not found for id: ${id}.`, HttpStatus.NOT_FOUND);
    }
    return reservation;
  }

  @Patch(':reservation_id')
  async update(@Request() req, @Param('id') eventId: string, @Param('reservation_id') reservationId: string, @Body() reservation: UpdateReservationDto): Promise<Reservation> {

    const existingEvent = await this.eventService.findOne(eventId);
    const existingReservation = await this.reservationService.findOne(reservationId);
    if (existingEvent.userId === req.user.userId || existingReservation.userId === req.user.userId) {
      return await this.reservationService.update(reservationId, reservation);
    }
    if (null === existingReservation) {
      throw new HttpException(`reservation not found for id : ${reservationId}`, HttpStatus.BAD_REQUEST);
    } else if (null === existingEvent) {
      throw new HttpException(`Event not found for id : ${eventId}`, HttpStatus.BAD_REQUEST);
    } else if (existingEvent.userId !== req.user.userId || existingReservation.userId !== req.user.userId) {
      throw new HttpException(`You don't have permission to access this resource.`, HttpStatus.FORBIDDEN);
    }
  }
}

