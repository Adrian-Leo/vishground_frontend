import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button
} from '@material-tailwind/react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <>
      <img
        src='https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
        className='absolute inset-0 z-0 h-full w-full object-cover'
      />
      <div className='absolute inset-0 z-0 h-full w-full bg-black/50' />
      <div className='container mx-auto p-4'>
        <Card className='absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4'>
          <CardHeader
            variant='gradient'
            className='mb-4 grid h-28 place-items-center bg-purple-light'
          >
            <Typography variant='h3' color='white' className='text-center'>
              Welcome To
              <span className='block text-center'>VishGround</span>
            </Typography>
          </CardHeader>
          <CardBody className='flex flex-col gap-4'>
            <Input type='email' label='Email' size='lg' />
            <Input type='password' label='Password' size='lg' />
            <div className='-ml-2.5'>
              <Checkbox label='Remember Me' />{' '}
            </div>
          </CardBody>
          <CardFooter className='pt-0'>
            <Link to='/Dashboard'>
              <Button className='w-full bg-purple-dark text-white text-md'>
                Sign In
              </Button>
            </Link>
            <Typography variant='small' className='mt-6 flex justify-center'>
              Don't have an account?
              <Link to='/SignUp'>
                <Typography
                  as='span'
                  variant='small'
                  className='ml-1 font-bold'
                >
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default Login
