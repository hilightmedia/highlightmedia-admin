declare module "react-facebook-login" {
  const FacebookLogin: any;
  export default FacebookLogin;
}

declare module 'react-facebook-login/dist/facebook-login-render-props' {
  import { ComponentType } from 'react';
  const FacebookLogin: ComponentType<any>;
  export default FacebookLogin;
}
