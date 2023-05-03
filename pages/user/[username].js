import { useRouter } from 'next/router';
import { MongoClient } from 'mongodb';

export async function getServerSideProps(context) {
  const { username } = context.query;

  // Connect to MongoDB
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  
  // Fetch user data
  const user = await client.db().collection('users').findOne({ username }, { projection: { password: 0, _id: 0 } });

  if (!user) {
    return { notFound: true };
  }

  return { props: { user } };
}

export default function UserProfilePage({ user }) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    <div className="bg-slate-900  w-screen h-screen">
      <div className="flex flex-col items-center w-full h-full">
        <div className="order-1 ">
          <br></br>
          <br></br>
          <br></br>
        </div>
        <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center flex w-1/2 h-1/4 order-2 ">
          <div className="float-left"></div>
          <div className="flex flex-col container justify-center">
            <div className="order-1">
              <h1 className="text-white">{user.username}</h1>
              <h1></h1>
            </div>
          </div>
        </div>

        <div className="order-3 ">
          <br></br>
        </div>

        <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center flex w-5/6 h-1/4 order-4 pt-6"></div>
      </div>
    </div>
  </div>
  );
}
