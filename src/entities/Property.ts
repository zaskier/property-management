import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { RawWeatherData } from '../types/weather.js';

@Entity('property')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  street: string;

  @Index()
  @Column({ type: 'varchar' })
  state: string;

  @Column({ type: 'varchar' })
  zipCode: string;

  @Column({ type: 'jsonb', nullable: true })
  weather: RawWeatherData | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  long: number | null;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}
