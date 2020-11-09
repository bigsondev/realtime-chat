import { Typography, Box, Link, makeStyles } from '@material-ui/core';
import { Favorite } from '@material-ui/icons';

const useStyles = makeStyles({
  linkHolder: {
    textDecoration: 'underline',
  },
});

export const BigsonDevFooter = () => {
  const { linkHolder } = useStyles();

  return (
    <Box mt={3}>
      <Typography align="center" variant="body2" gutterBottom>
        Made with <Favorite color="secondary" /> by{' '}
        <Link
          href="https://bigsondev.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkHolder}
        >
          BigsonDev
        </Link>
        . Source code available on{' '}
        <Link
          href="https://github.com/bigsondev/realtime-chat"
          target="_blank"
          rel="noopener noreferrer"
          className={linkHolder}
        >
          GitHub
        </Link>
        .
      </Typography>
      <Typography align="center" variant="body2">
        {`Let's`}{' '}
        <Link
          href="https://bigsondev.com/mentorship/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkHolder}
        >
          skyrocket
        </Link>{' '}
        in Frontend together 🚀
      </Typography>
    </Box>
  );
};
