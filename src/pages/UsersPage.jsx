import {
    Box,
    Paper,
    Typography,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    LinearProgress,
    InputAdornment,
} from "@mui/material";
import {
    DeleteOutlined,
    LockResetOutlined,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
    getAllUsers,
    updateUserById,
    deleteUserById,
} from "../api/admin.api.js";
import { resetPassword } from "../api/public.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { DataGrid } from "@mui/x-data-grid";

const roleOptions = ["cliente", "moderador", "administrador"];
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function PasswordInput({ label, value, onChange, error }) {
    const [show, setShow] = useState(false);
    return (
        <TextField
            label={label}
            type={show ? "text" : "password"}
            value={value}
            onChange={onChange}
            fullWidth
            variant="outlined"
            error={error}
            helperText={error ? "Las contraseñas no coinciden" : ""}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShow((prev) => !prev)} edge="end">
                            {show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                fontFamily: '"Archivo Black", sans-serif',
                "& label": {
                    color: error ? "red" : "black",
                    fontFamily: '"Archivo Black", sans-serif',
                },
                "& label.Mui-focused": {
                    color: error ? "red" : "black",
                },
                "& .MuiInputLabel-outlined": {
                    backgroundColor: "white",
                    padding: "0 4px",
                    transform: "translate(14px, 12px) scale(1)",
                },
                "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                },
                "& .MuiOutlinedInput-root": {
                    borderRadius: "3px",
                    "& fieldset": {
                        borderColor: error ? "red" : "black",
                        borderWidth: "2px",
                    },
                    "&:hover fieldset": {
                        borderColor: error ? "red" : "black",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: error ? "red" : "black",
                    },
                },
                "& .MuiFormHelperText-root": {
                    fontFamily: '"Archivo Black", sans-serif',
                    color: "red",
                    marginLeft: 0,
                },
            }}
        />
    );
};

const UsersPage = () => {
    const { user } = useAuth();
    const theme = useTheme();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({ password: "", confirm: "" });
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const { data } = await getAllUsers();
            setUsers(data);
        } catch (e) {
            console.error("Error al obtener usuarios:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (id, newRole) => {
        if (!window.confirm("¿Seguro de cambiar el rol?")) return;
        setUpdating(id);
        try {
            await updateUserById(id, { role: newRole }, user.token);
            await fetchUsers();
        } catch (e) {
            console.error("Error al actualizar rol:", e);
        } finally {
            setUpdating(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro de eliminar el usuario?")) return;
        setUpdating(id);
        try {
            await deleteUserById(id, user.token);
            await fetchUsers();
        } catch (e) {
            console.error("Error al eliminar usuario:", e);
        } finally {
            setUpdating(null);
        }
    };

    const openPwdDlg = (user) => {
        setSelectedUser(user);
        setPasswordData({ password: "", confirm: "" });
        setOpenDialog(true);
    };
    const closePwdDlg = () => setOpenDialog(false);

    const submitPwd = async () => {
        const { password, confirm } = passwordData;
        if (password.length < 6) return alert("Mínimo 6 caracteres.");
        if (password !== confirm) return alert("Las contraseñas no coinciden.");
        try {
            await resetPassword({ email: selectedUser.email, newPassword: password });
            alert("Contraseña actualizada.");
            closePwdDlg();
        } catch (e) {
            console.error("Error:", e);
            alert("Error al actualizar.");
        }
    };

    const passwordMismatch = passwordData.password !== passwordData.confirm;

    const columns = [
        {
            field: "fullName",
            headerName: "Nombre",
            flex: 1,
            renderCell: (params) => params.value || "-",
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1.5,
        },
        {
            field: "role",
            headerName: "Rol",
            flex: 1,
            renderCell: (params) => {
                const isCurrentUser = params.row._id === user._id;
                return (
                    <select
                        value={params.row.role}
                        disabled={isCurrentUser || updating === params.row._id}
                        onChange={(e) => handleRoleChange(params.row._id, e.target.value)}
                        style={{
                            fontFamily: '"Archivo Black", sans-serif',
                            width: "100%",
                            padding: "5px",
                            borderRadius: 4,
                        }}
                    >
                        {roleOptions.map((r) => (
                            <option key={r} value={r}>
                                {capitalize(r)}
                            </option>
                        ))}
                    </select>
                );
            },
        },
        {
            field: "actions",
            headerName: "Acciones",
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                const isCurrentUser = params.row._id === user._id;
                return (
                    <>
                        {!isCurrentUser && (
                            <Tooltip title="Eliminar usuario">
                                <IconButton
                                    onClick={() => handleDelete(params.row._id)}
                                    disabled={updating === params.row._id}
                                >
                                    <DeleteOutlined />
                                </IconButton>
                            </Tooltip>
                        )}
                        {isCurrentUser && (
                            <Tooltip title="Cambiar mi contraseña">
                                <IconButton onClick={() => openPwdDlg(params.row)}>
                                    <LockResetOutlined />
                                </IconButton>
                            </Tooltip>
                        )}
                    </>
                );
            },
        },
    ];

    return (
        <Paper
            sx={{
                p: 3,
                backgroundColor: "#fefefe",
                border: "3px solid black",
                borderRadius: 1,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: '"Archivo Black", sans-serif',
                        letterSpacing: "-5px",
                        textTransform: "uppercase",
                        textDecoration: "underline",
                    }}
                >
                    Gestión de usuarios
                </Typography>
            </Box>

            <DataGrid
                autoHeight
                rows={users}
                getRowId={(r) => r._id}
                columns={columns}
                loading={loading}
                components={{ LoadingOverlay: LinearProgress }}
                pageSize={8}
                sx={{
                    fontFamily: '"Archivo Black", sans-serif',
                    border: "3px solid black",
                    boxShadow: 1,
                    borderRadius: 1,
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "white",
                        fontSize: 16,
                        borderBottom: "1px solid black",
                    },
                    "& .MuiDataGrid-cell": {
                        fontSize: 15,
                        borderBottom: "1px solid black",
                    },
                }}
            />

            <Dialog open={openDialog} onClose={closePwdDlg} fullWidth maxWidth="xs">
                <DialogTitle
                    sx={{
                        fontFamily: '"Archivo Black", sans-serif',
                        textAlign: "center",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        fontSize: "1.4rem",
                        borderBottom: "2px solid black",
                        letterSpacing: "-2px",
                    }}
                >
                    Cambiar contraseña
                </DialogTitle>

                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        mt: 2,
                        px: 3,
                        minHeight: "300px",
                        justifyContent: "center",
                    }}
                >
                    <PasswordInput
                        label="Nueva contraseña"
                        value={passwordData.password}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, password: e.target.value })
                        }
                        error={passwordMismatch && passwordData.confirm.length > 0}
                    />
                    <PasswordInput
                        label="Confirmar contraseña"
                        value={passwordData.confirm}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, confirm: e.target.value })
                        }
                        error={passwordMismatch && passwordData.confirm.length > 0}
                    />
                </DialogContent>

                <DialogActions
                    sx={{
                        justifyContent: "space-between",
                        px: 3,
                        pb: 2,
                        pt: 1,
                        borderTop: "2px solid black",
                    }}
                >
                    <Button onClick={closePwdDlg} sx={{ fontWeight: "bold", color: "black" }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={submitPwd}
                        sx={{
                            fontWeight: "bold",
                            backgroundColor: "black",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#222",
                            },
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default UsersPage;
