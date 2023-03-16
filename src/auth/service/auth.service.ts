import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { signatureDto } from '../dto/signature.dto';
import Web3 from 'web3';
import bcrypt from 'bcryptjs';
import { AdminData } from '../../admin/admin.schema';
import { UserData } from '../../user/schema/user.schema';
import { TokenDto } from '../dto/token.dto';
import { Role } from '../../components/enum';
import { createUserDto, signatureInfo } from '../dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignatureData, SignatureDocument } from '../schema/signature.schema';
import { UserService } from 'src/user/service/user.service';
import { HttpException, HttpStatus } from "@nestjs/common";
import { UserDto } from 'src/user/dto/user.dto';


@Injectable()
export class AuthService {
  private readonly Web3: Web3;
  constructor(
    @InjectModel(SignatureData.name) private signatureSchema: Model<SignatureDocument>,
    private userService: UserService,
    private jwtService: JwtService) {
    this.Web3 = new Web3();
  }

  async createUser(username: string, password: string) {
    const wallet = this.Web3.eth.accounts.create()
    const userPriv = wallet.privateKey
    const message = username + password
    const signature = this.Web3.eth.accounts.sign(message, userPriv)
    const user = await this.userService.findAddressOrCreate(wallet.address)
    const createUser = await this.signatureSchema.findOne({ username })
    if (createUser) {
      throw new HttpException('username is already', 403)
    } else {
      await this.signatureSchema.create({
        username: username,
        password: password,
        privateKey: userPriv,
        signature: signature.signature,
        address: wallet.address
      })
      return this.jwtService.sign({
        userId: user.id,
        message: message,
        signature: signature.signature
      })
    }

  }

  async findAddress(username) {
    return this.signatureSchema.findOne({ username })
  }

  async recoverAddress(signature) {
    const message = signature.username + signature.password
    return this.Web3.eth.accounts.recover(
      message,
      signature.signature
    );
  }

  verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async generateJwtToken(user, role: Role) {
    return {
      accessToken: this.jwtService.sign({
        address: user.address,
        sub: user._id,
        role,
      }),
    };
  }

  decodeToken(token: string) {
    return this.jwtService.verify<{ token: TokenDto }>(token);
  }
}
