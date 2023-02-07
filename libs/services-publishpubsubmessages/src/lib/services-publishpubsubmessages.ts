import { PubSub } from '@google-cloud/pubsub';
import { catchError, from, map, throwError, retry, switchMap } from 'rxjs';
import * as functions from 'firebase-functions';

export class PublishPubSubMessage {
  /**
   * publishPubSubMessage
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public publishPubSubMessage(pubsubTopicName: string, messagedata: any) {
    const pubSubClient = new PubSub();
    let dataBuffer: Buffer  | undefined = undefined;

 // Create publisher options
 const options = {
  batching: {
    maxMessages: 500,
    maxMilliseconds: 5000,
  },
  retry: {
    retryCodes: [
      10, // 'ABORTED'
      1, // 'CANCELLED',
      4, // 'DEADLINE_EXCEEDED'
      13, // 'INTERNAL'
      8, // 'RESOURCE_EXHAUSTED'
      14, // 'UNAVAILABLE'
      2, // 'UNKNOWN'
    ],
    backoffSettings: {
      // The initial delay time, in milliseconds, between the completion
      // of the first failed request and the initiation of the first retrying request.
      initialRetryDelayMillis: 100,
      // The multiplier by which to increase the delay time between the completion
      // of failed requests, and the initiation of the subsequent retrying request.
      retryDelayMultiplier: 1.3,
      // The maximum delay time, in milliseconds, between requests.
      // When this value is reached, retryDelayMultiplier will no longer be used to increase delay time.
      maxRetryDelayMillis: 60000,
      // The initial timeout parameter to the request.
      initialRpcTimeoutMillis: 5000,
      // The multiplier by which to increase the timeout parameter between failed requests.
      rpcTimeoutMultiplier: 1.0,
      // The maximum timeout parameter, in milliseconds, for a request. When this value is reached,
      // rpcTimeoutMultiplier will no longer be used to increase the timeout.
      maxRpcTimeoutMillis: 600000,
      // The total time, in milliseconds, starting from when the initial request is sent,
      // after which an error will be returned, regardless of the retrying attempts made meanwhile.
      totalTimeoutMillis: 600000,
    },
  }
};

    const pubsubTopic = pubSubClient.topic(pubsubTopicName, options);
    if (typeof messagedata === 'string' || messagedata instanceof String) {
      dataBuffer = Buffer.from(messagedata);
    } else if (typeof messagedata === 'object') {
      dataBuffer = Buffer.from(JSON.stringify(messagedata));
    } else if (typeof messagedata === 'number' || typeof messagedata === 'boolean'){
      dataBuffer = Buffer.from(messagedata.toString());
    }

    const publishTopic = from(pubsubTopic.publishMessage({ data: dataBuffer }));
    return publishTopic
      .pipe(
        map((r) => r),
        retry(2),
        catchError((error) => {
          functions.logger.debug(`pubsubTopic: ${error}`)
          if(error.code == 5) {
          const managedError = from(pubSubClient.createTopic(pubsubTopicName))
          .pipe(
            switchMap( () => from(pubsubTopic.publishMessage({ data: dataBuffer }))),
            catchError(err => {
              throw 'Second Attempt to publish PubSub Message Error Details: ' + err;
            })
          );
          return managedError;
        } else {
          return throwError(() => new Error(' PubSub Message Error Details'))
        }

        })
      )

  }
}
