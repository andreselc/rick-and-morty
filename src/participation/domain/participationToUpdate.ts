export class ParticipationToUpdate {
  participationId: number;
  timeInit: string;
  timeFinished: string;

  constructor(participationId: number, timeInit: string, timeFinished: string) {
    this.participationId = participationId;
    this.timeInit = timeInit;
    this.timeFinished = timeFinished;
  }
}