import { useRouter } from "next/router";
import { MongoClient } from "mongodb";
import { useSession, signOut, getSession } from "next-auth/react";
import { useEffect } from "react";

export async function getServerSideProps(context) {
  const { username } = context.query;
  const session = await getSession(context);

  // Connect to MongoDB
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  // Fetch user data
  const user = await client
    .db()
    .collection("users")
    .findOne({ username }, { projection: { password: 0, _id: 0 } });

  if (!user) {
    return { notFound: true };
  }

   // Fetch user's posts
   const posts = await client
   .db()
   .collection("posts")
   .find({ user: 'test' }, { projection: { _id: 0 , createdAt: 0} })
   .toArray();

   console.log(posts)

  return { props: { user, session, posts } };
}

export default function UserProfilePage({ user, posts }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
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

            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center flex w-5/6 h-1/4 order-4 pt-6">
              {posts.map((post, index) => (
                <div key={index}>
                  <h2>{post.sliderRating}</h2>
                  <p>{post.sliderRating}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-slate-900 h-screen">
        <div className="">
        <h1 className="text-white ">You must be signed in to view this page</h1>
        <h2
          className="text-white hover:text-blue-600 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Click me to sign in!
        </h2>
        </div>
      </div>
    );
  }
}
