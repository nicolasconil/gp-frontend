import { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, useMediaQuery, Box, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined';
import AccountIcon from '@mui/icons-material/PersonOutlineOutlined';

const navItems = ['SHOP', 'MÁS', 'SALE'];

const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:900px)');

    const toggleDrawer = () => {
        setDrawerOpen((prev) => !prev);
    };

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'black', borderBottom: '1px solid #eee' }}>
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 4 }, py: { xs: 1, md: 2 } }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 4 } }}>
                        {isMobile && (
                            <IconButton edge="start" onClick={toggleDrawer}>
                                <MenuIcon sx={{ color: 'black' }} />
                            </IconButton>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 400, fontSize: { xs: '2rem', md: '2.5rem' }, color: 'black', userSelect: 'none' }}>
                                gp
                            </Typography>
                            <Typography component="span" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 400, fontSize: { xs: '1.2rem', md: '1.6rem' }, color: 'black', }}>
                                ®
                            </Typography>
                        </Box>
                    </Box>

                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            {navItems.map((item) => (
                                <Box key={item} sx={{ px: 1 }}>
                                    <Typography
                                        variant="button"
                                        sx={{ 
                                            fontSize: '1rem', 
                                            letterSpacing: 1, 
                                            fontWeight: 'bold', 
                                            cursor: 'pointer',
                                            position: 'relative',
                                            display: 'inline-block',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '2px',
                                                backgroundColor: 'black',
                                                transform: 'scaleX(0)',
                                                transition: 'transform 0.3s ease',
                                                transformOrigin: 'left',
                                            },
                                            '&:hover::after': {
                                                transform: 'scaleX(1)',
                                            },
                                        }}
                                    >
                                        {item}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {[<SearchIcon />, <AccountIcon />, <ShoppingBagIcon />].map((Icon, i) => (
                            <IconButton
                                key={i}
                                sx={{ color: 'black' }}
                            >
                                {Icon}
                            </IconButton>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Box sx={{ width: 250, p: 2 }} role="presentation" onClick={toggleDrawer}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Archivo Black", sans-serif',
                                fontWeight: 400,
                                fontSize: '2rem',
                                color: 'black',
                                userSelect: 'none',
                            }}
                        >
                            gp
                        </Typography>
                        <Typography
                            component="span"
                            sx={{
                                fontFamily: '"Archivo Black", sans-serif',
                                fontWeight: 400,
                                fontSize: '1.2rem',
                            }}
                        >
                            ®
                        </Typography>
                    </Box>
                    <Divider />
                    <List>
                        {navItems.map((text) => (
                            <ListItem button key={text}>
                                <ListItemText primary={<Typography sx={{ fontSize: '1rem', letterSpacing: 1, fontWeight: 500 }}> {text} </Typography>} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Header;