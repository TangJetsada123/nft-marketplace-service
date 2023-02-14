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
import { access } from 'fs';

@Injectable()
export class AuthService {
  private readonly Web3: Web3;
  constructor(
    @InjectModel(SignatureData.name) private signatureSchema: Model<SignatureDocument>,
    private jwtService: JwtService) {
    this.Web3 = new Web3();
  }

  createUser(password: string) {
    const wallet = this.Web3.eth.accounts.create()
    const userAddress = wallet.address
    const userPriv = wallet.privateKey
    const signature = this.Web3.eth.accounts.sign("hello",userPriv)
    console.log(signature)
    const data = {
      address: userAddress,
      privateKey: userPriv,
      password: password,
      signature: signature.signature
    }
    return this.signatureSchema.create(data)
  }

  async findAddress(password: createUserDto) {
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

  generateTokenSignature(userInfo: signatureInfo) {
    const address  = this.Web3.eth.accounts.recover("hello",userInfo.signature)
    return {
      accessToken: this.jwtService.sign({
          sub:  address
      })
    }
  }
}
