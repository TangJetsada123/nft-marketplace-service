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


@Injectable()
export class AuthService {
  private readonly Web3: Web3;
  constructor(
    @InjectModel(SignatureData.name) private signatureSchema: Model<SignatureDocument>,
    private userService: UserService,
    private jwtService: JwtService) {
    this.Web3 = new Web3();
  }

  async createUser(password: string) {
    const wallet = this.Web3.eth.accounts.create()
    const userAddress = wallet.address
    const userPriv = wallet.privateKey
    const signature = this.Web3.eth.accounts.sign("hello", userPriv)
    const data = {
      address: userAddress,
      privateKey: userPriv,
      password: password,
      signature: signature.signature
    }
    const user = await this.userService.findAddressOrCreate(data.address)
    console.log("user",user)
    const addressId = user.address
    this.signatureSchema.create({
      address: addressId,
      password: password,
      user_id: user._id
    })
    return this.jwtService.sign({
      sub: user._id,
      address: addressId,
      role: Role.USER
    })
  }

  async findAddress(password: createUserDto) {
    console.log(await this.signatureSchema.findOne(password))
    return this.signatureSchema.findOne(password)
  }

  async recoverAddress(signature: signatureDto) {
    return this.Web3.eth.accounts.recover(
      signature.message,
      signature.signature
    );
  }

  verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async generateJwtToken(user: UserData | AdminData, role: Role) {
    return {
      accessToken: this.jwtService.sign({
        sub: user._id,
        role,
      }),
    };
  }

  decodeToken(token: string) {
    return this.jwtService.verify<{ token: TokenDto }>(token);
  }

  async generateTokenSignature(userInfo: signatureInfo) {
    const userId = await this.userService.findByAddress(userInfo.address)   
    return {
      accessToken: this.jwtService.sign({
        sub: userId._id,
        address: userId.address,
        sig: userInfo.signature,
        role: Role.USER
      })
    }
  }
}
