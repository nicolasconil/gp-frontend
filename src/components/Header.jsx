import { useState, useRef } from "react";
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, useMediaQuery, Box, Divider, InputBase, ClickAwayListener } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined';
import AccountIcon from '@mui/icons-material/PersonOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';

const navItems = ['SHOP', 'MÁS', 'SALE'];

const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [submenuVisible, setSubmenuVisible] = useState(false);
    const isMobile = useMediaQuery('(max-width:900px)');
    const submenuTimeout = useRef();

    const toggleDrawer = () => setDrawerOpen(prev => !prev);

    const handleSubmenuEnter = () => {
        clearTimeout(submenuTimeout.current);
        setSubmenuVisible(true);
    };

    const handleSubmenuLeave = () => {
        submenuTimeout.current = setTimeout(() => {
            setSubmenuVisible(false);
        }, 200);
    };

    const products = [
        { _id: '1', name: 'Zapatilla 1', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042258_800.jpg' },
        { _id: '2', name: 'Zapatilla 2', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537975_800.jpg' },
        { _id: '3', name: 'Zapatilla 3', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537126_800.jpg' },
        { _id: '4', name: 'Zapatilla 4', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/12/24/10356147_800.jpg' },
        { _id: '5', name: 'Zapatilla 5', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537450_800.jpg' },
    ];

    const filteredResults = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderSearchResults = () => {
        if (searchTerm.length <= 0 || filteredResults.length === 0) return null;
        if (isMobile) {
            return (
                <Box sx={{ width: '100%', maxWidth: '600px', mt: 2, maxHeight: '70vh', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, backgroundColor: 'white', zIndex: 10, pb: 2 }}>
                    {filteredResults.map(product => (
                        <Box key={product._id} sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { opacity: 0.85 }, px: 1 }}>
                            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', mt: 1, color: 'black' }}>{product.name}</Typography>
                        </Box>
                    ))}
                </Box>
            );
        }
        return (
            <Box sx={{ position: 'fixed', top: '70px', left: 0, backgroundColor: 'white', display: 'flex', gap: 3, py: 3, px: 5, zIndex: 1200, overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'thin', '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: 3 } }}>
                {filteredResults.map(product => (
                    <Box key={product._id} sx={{ flex: '0 0 auto', width: 220, textAlign: 'center', cursor: 'pointer', '&:hover': { opacity: 0.85 } }}>
                        <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
                        <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', mt: 1, color: 'black', whiteSpace: 'normal' }}>
                            {product.name}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'black', borderBottom: '1px solid #eee' }}>
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 4 }, py: { xs: 0.2, md: 0.6 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 4 } }}>
                        {isMobile && (
                            <IconButton edge="start" onClick={toggleDrawer}>
                                <MenuIcon sx={{ color: 'black' }} />
                            </IconButton>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/logo.svg" alt="logo" style={{ height: '38px' }} />
                        </Box>
                    </Box>

                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 3, ml: 6, mr: 4 }}>
                            {navItems.map((item) => (
                                <Box key={item} onMouseEnter={item === 'MÁS' ? handleSubmenuEnter : undefined} onMouseLeave={item === 'MÁS' ? handleSubmenuLeave : undefined}>
                                    <Typography variant="button" sx={{ fontSize: '1rem', letterSpacing: 1, fontWeight: 'bold', cursor: 'pointer', position: 'relative', display: 'inline-block', '&::after': { content: '""', position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', backgroundColor: 'black', transform: 'scaleX(0)', transition: 'transform 0.3s ease', transformOrigin: 'left', }, '&:hover::after': { transform: 'scaleX(1)' } }}>
                                        {item}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, justifyContent: 'flex-end' }}>
                        {!isMobile && (
                            <ClickAwayListener onClickAway={() => setSearchTerm('')}>
                                <Box sx={{ width: { xs: '100%', sm: '300px', md: '400px' }, position: 'relative', mr: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', padding: '5px 10px', backgroundColor: 'white', border: '2px solid black', borderRadius: '999px', position: 'relative' }}>
                                        <SearchIcon sx={{ position: 'absolute', left: 12, color: 'black', fontSize: 20 }} />
                                        <InputBase fullWidth placeholder="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ fontSize: '16px', fontWeight: '400', pl: 4, pr: 4 }} />
                                        {searchTerm.length > 0 && (
                                            <IconButton onClick={() => setSearchTerm('')} sx={{ position: 'absolute', right: 5, p: '4px', color: 'black' }}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                    {renderSearchResults()}
                                </Box>
                            </ClickAwayListener>
                        )}
                        <IconButton sx={{ color: 'black' }}><AccountIcon /></IconButton>
                        <IconButton sx={{ color: 'black' }}><ShoppingBagIcon /></IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {!isMobile && submenuVisible && (
                <Box onMouseEnter={handleSubmenuEnter} onMouseLeave={handleSubmenuLeave} sx={{ width: '100%', backgroundColor: '#fff', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'center', gap: 4, py: 6, zIndex: 1000 }}>
                    {['NOSOTROS', 'FAQs', 'SEGUINOS'].map((item) => (
                        <Typography key={item} sx={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                            {item}
                        </Typography>
                    ))}
                </Box>
            )}

            {isMobile && (
                <Box sx={{ px: 2, py: 2, display: 'flex', backgroundColor: 'white', flexDirection: 'column', alignItems: 'center' }}>
                    <ClickAwayListener onClickAway={() => setSearchTerm('')}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', padding: '5px 10px', backgroundColor: 'white', border: '2px solid black', borderRadius: '999px', position: 'relative' }}>
                            <SearchIcon sx={{ position: 'absolute', left: 12, color: 'black', fontSize: 20 }} />
                            <InputBase fullWidth placeholder="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ fontSize: '16px', fontWeight: '400', pl: 4, pr: 4 }} />
                            {searchTerm.length > 0 && (
                                <IconButton onClick={() => setSearchTerm('')} sx={{ position: 'absolute', right: 5, p: '4px', color: 'black' }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    </ClickAwayListener>
                    {renderSearchResults()}
                </Box>
            )}

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Box sx={{ width: 250, p: 2 }} role="presentation" onClick={toggleDrawer}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <img src="/logo.svg" alt="logo" style={{ height: '38px' }} />
                    </Box>
                    <Divider />
                    <List>
                        {navItems.map((text) => (
                            <ListItem button key={text}>
                                <ListItemText primary={
                                    <Typography sx={{ fontSize: '1rem', letterSpacing: 1, fontWeight: 500 }}>
                                        {text}
                                    </Typography>
                                } />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Header;
