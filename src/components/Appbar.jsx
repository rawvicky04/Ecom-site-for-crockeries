import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "./redux/userSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { reset } from "./redux/CounterSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function Appbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const badgeCount = useSelector((state) => state.counter.value);
  const user = useSelector((state) => state.user.name);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const vertical = "top",
    horizontal = "center";
  const navigate = useNavigate();
  const handleUserLogout = () => {
    dispatch(reset());
    dispatch(userLogout());
    // dispatch(reset());
    setAnchorEl(null);
    handleMobileMenuClose();
    setOpenSuccessSnackbar(true);
    navigate("/");
  };

  const handleProfilePage = () => {
    navigate("/profile");
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleSuccessSnackClose = () => {
    setOpenSuccessSnackbar(false);
  };

  const handleProfileMenuOpen = (event) => {
    if (user !== "") {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    console.log(event.currentTarget);
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfilePage}>My account</MenuItem>
      <MenuItem onClick={handleUserLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <Link to="/" style={{ textDecoration: "none", color: "black" }}>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="home"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <HomeIcon />
          </IconButton>
          <p>Home</p>
        </MenuItem>
      </Link>
      <Link to="/cart" style={{ textDecoration: "none", color: "black" }}>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
          >
            <Badge badgeContent={badgeCount} color="error">
              <AddShoppingCartIcon />
            </Badge>
          </IconButton>
          <p>Cart</p>
        </MenuItem>
      </Link>
      {user && <Link to="/order" style={{ textDecoration: "none", color: "black" }}>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="order"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <ShoppingBagIcon />
          </IconButton>
          <p>Orders</p>
        </MenuItem>
      </Link>}
      {/* <MenuItem>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem> */}
      <Link
        to={user === "" ? "/login" : ""}
        style={{ textDecoration: "none", color: "black" }}
      >
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p onClick={handleProfileMenuOpen}>Profile</p>
        </MenuItem>
      </Link>

      

      {user === "Prabhat" && (
        <Link
          to="/admin"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <MenuItem>
            <IconButton
              size="large"
              aria-label="admin-section"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AdminPanelSettingsIcon />
            </IconButton>
            <p>Admin</p>
          </MenuItem>
        </Link>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ background: "#fff" }}>
        <Toolbar>
          {/* <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton> */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { sm: "block" } }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
              Crockery Wala
            </Link>
          </Typography>
          <Search sx={{ display: { xs: "none", md: "block" } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "black",
                display: "flex",
                marginRight: "15px",
              }}
            >
              <Button
                variant="text"
                startIcon={<HomeIcon />}
                sx={{ color: "#000000" }}
              >
                Home
              </Button>
            </Link>
            <Link
              to="/cart"
              style={{
                textDecoration: "none",
                color: "black",
                display: "flex",
                marginRight: "15px",
              }}
            >
              <Button
                variant="text"
                startIcon={
                  <Badge badgeContent={badgeCount} color="error">
                    <AddShoppingCartIcon />
                  </Badge>
                }
                sx={{ color: "#000000" }}
              >
                Cart
              </Button>
            </Link>
            {user && <Link
              to="/order"
              style={{
                textDecoration: "none",
                color: "black",
                display: "flex",
                marginRight: "15px",
              }}
            >
              <Button
                variant="text"
                startIcon={<ShoppingBagIcon />}
                sx={{ color: "#000000" }}
              >
                Orders
              </Button>
            </Link>}
            {/* <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="black"

                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton> */}
            <Link
              to={user === "" ? "/login" : ""}
              style={{
                textDecoration: "none",
                color: "black",
                display: "flex",
                marginRight: "15px",
              }}
            >
              <Button
                variant="text"
                startIcon={<AccountCircle />}
                sx={{ color: "#000000" }}
                onClick={handleProfileMenuOpen}
              >
                Profile
              </Button>
            </Link>

            {user === "Prabhat" && (
              <Link
                to="/admin"
                style={{
                  textDecoration: "none",
                  color: "black",
                  display: "flex",
                }}
              >
                <Button
                  variant="text"
                  startIcon={<AdminPanelSettingsIcon />}
                  sx={{ color: "#000000" }}
                >
                  Admin
                </Button>
              </Link>
            )}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="black"
            >
              {/* <MoreIcon /> */}
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {openSuccessSnackbar && (
        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={2000}
          anchorOrigin={{ vertical, horizontal }}
          onClose={handleSuccessSnackClose}
        >
          <Alert
            onClose={handleSuccessSnackClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            You have been successfully logout.
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default Appbar;
