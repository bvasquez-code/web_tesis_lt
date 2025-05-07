import { TopicEntity } from '../entity/TopicEntity';

export class TopicRegisterDto {
  public topic: TopicEntity;

  constructor(topic?: TopicEntity) {
    this.topic = topic ? topic : new TopicEntity();
  }
}