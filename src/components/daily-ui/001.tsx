/**
 * Sign up page for cooking website
 * @returns
 */
const Day001 = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-opacity-40 bg-[url('/assets/images/daily-ui/001/001-background.jpg')] bg-center bg-no-repeat">
      <div className="z-10 h-fit w-11/12 gap-3 rounded-3xl bg-slate-500 bg-opacity-20 p-3 text-center shadow backdrop-blur-sm sm:w-2/3">
        <iframe
          className="h-36 w-full"
          src="https://lottie.host/embed/0ddb2b7d-4962-423e-a221-f982c23b3414/52JzLUwmpp.json"
        ></iframe>
        <h1 className="text-3xl">Sign Up</h1>
        <p className="text-lg">Start your cooking journey today!</p>

        {/*Socail logins */}
        <div className="p-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <button className="text-normal inline-flex w-full items-center justify-center gap-2 rounded-md border bg-white p-2 font-sans text-slate-800">
              <svg
                width="256"
                height="262"
                viewBox="0 0 256 262"
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                />
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                />
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                />
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                />
              </svg>
              Sign Up with Google
            </button>
            <button className="text-normal inline-flex w-full items-center justify-center gap-2 rounded-md border bg-white p-2 font-sans text-slate-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                fill="url(#a)"
                height="40"
                width="40"
                className="h-8 w-8"
              >
                <defs>
                  <linearGradient x1="50%" x2="50%" y1="97.078%" y2="0%" id="a">
                    <stop offset="0%" stop-color="#0062E0" />
                    <stop offset="100%" stop-color="#19AFFF" />
                  </linearGradient>
                </defs>
                <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
                <path
                  fill="#FFF"
                  d="m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
                />
              </svg>
              Sign Up with Facebook
            </button>
          </div>

          <hr className="my-4 h-px w-full bg-slate-400" />

          {/*Email */}
          <form className="relative flex h-fit w-full flex-col gap-1">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-2 left-3 z-20 w-5"
            >
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="1.5"
                stroke="#141B34"
                d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"
              ></path>
              <path
                stroke-linejoin="round"
                stroke-width="1.5"
                stroke="#141B34"
                d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
              ></path>
            </svg>
            <input
              placeholder="john@example.com"
              title="Inpit title"
              name="input-name"
              type="email"
              className="h-10 w-auto rounded-lg pl-10 text-black outline-none filter focus:border-green-700 focus:shadow focus:ring-2 focus:ring-green-700"
              id="email_field"
            />
          </form>

          <button className="mt-2 w-1/2 rounded-md bg-gradient-to-bl from-green-700 to-green-400 p-2 text-white">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Day001;
