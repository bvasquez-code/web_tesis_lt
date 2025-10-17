import { Injectable } from '@angular/core';
import { AppSetting } from 'src/app/config/app.setting';
import { ApiService } from 'src/app/enterprise/compartido/service/api.service';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { EmailSendDto } from '../model/dto/EmailSendDto';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Ajusta esta base si tu @RequestMapping de clase difiere
  private base = `${AppSetting.API}/api/v1/notification`;

  constructor(private api: ApiService) {}

  /**
   * POST /email  -> NotificationController.sendEmail(EmailSendDto)
   */
  async sendEmail(request: EmailSendDto): Promise<ResponseWsDto> {
    const url = `${this.base}/sendEmail`;
    return await this.api.ExecutePostService(url, request);
  }
}
