import { HandlerContext, initializeServer } from '@nymphajs/server';
import { SerializedFragment, STATE_UPDATE } from '../shared-types';

const { events } = initializeServer(9000, true);

events.listen(STATE_UPDATE, ({ client, data }: HandlerContext) => {
  const dataToStore = data.data as SerializedFragment;

  const [prop, value] = dataToStore.data;
  if (!client.state) {
    client.state = {};
  }
  (client.state as Record<string, any>)[dataToStore.fragment][prop] = value;

  client.broadcast({
    type: STATE_UPDATE,
    data: dataToStore,
  });
});
