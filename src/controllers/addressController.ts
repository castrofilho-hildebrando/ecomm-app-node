// src/controllers/addressController.ts
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { AddressRepository } from '../application/ports/AddressRepository';
import { NotFoundError } from '../domain/errors/NotFoundError';

@injectable()
export class AddressController {
  constructor(
    @inject('AddressRepository') private addressRepository: AddressRepository
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const addressData = { ...req.body, userId };

      const address = await this.addressRepository.create(addressData);

      res.status(201).json({
        success: true,
        data: { address },
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const addresses = await this.addressRepository.findByUserId(userId);

      res.json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const address = await this.addressRepository.findByIdAndUserId(id, userId);
      if (!address) {
        throw new NotFoundError('Endereço');
      }

      const updated = await this.addressRepository.update(id, req.body);

      res.json({
        success: true,
        data: { address: updated },
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const deleted = await this.addressRepository.deleteByIdAndUserId(id, userId);
      if (!deleted) {
        throw new NotFoundError('Endereço');
      }

      res.json({
        success: true,
        message: 'Endereço removido com sucesso',
      });
    } catch (error) {
      next(error);
    }
  };
}