import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

const LoginLayout = (props: Props) => {
  return (
    <div className="w-full max-w-[1600px] flex xl:items-center mx-auto h-screen overflow-hidden">
      <div className="w-full flex gap-3">
        <div className="hidden w-6/12 xl:flex h-full pl-8">
          <Image
            alt="loginBanner"
            width="750"
            height="750"
            className="w-full max-w-[700px] max-h-[85vh] object-contain object-top"
            src="/loginBanner.png"
          />
        </div>
        <div className="w-full xl:w-6/12 p-8 xl:p-0 xl:pt-8 xl:pl-5 flex flex-col gap-3">
          <span className="w-full">
            <Image
              alt="loginBanner"
              width="250"
              height="100"
              className="w-[150px] object-contain"
              src="/logo.png"
            />
          </span>
          <div className="flex flex-col gap-5 items-center w-full xl:w-8/12 my-auto xl:my-20">  
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
