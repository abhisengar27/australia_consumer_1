import { Injectable } from "@angular/core";

@Injectable()
export class GoogleAnalyticsEventsService {
  public emitEvent(eventCategory: string, eventAction: string,eventLabel: string ,eventValue: number ) {
    ga('send', 'event', {
      eventCategory: eventCategory,
      eventAction: eventAction,
      eventLabel: eventLabel,
      eventValue: eventValue
    });
  }
}