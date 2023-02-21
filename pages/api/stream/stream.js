import { StreamApp, StatusUpdateForm, FlatFeed } from 'react-activity-feed';
import 'react-activity-feed/dist/index.css';
import stream from 'getstream';
import {connect} from 'getstream'

const client = connect(
    'pz5fz98fpwn6',
    'vhq3vjm4gjwkgw9bryxf25qkbq5rbhvcsg3vkcjszqhnnfns6xgvmt2pk2b4x7gg',
    '1235900',
    { location: 'ohio' },
    {browser: false}
  );
  
   const userToken = client.createUserToken('userid');

