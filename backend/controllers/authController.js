const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, pin } = req.body;
    
    const userCount = await User.count();
    
    if (userCount > 0) {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const adminUser = await User.findByPk(decoded.id);
          
          if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Solo administradores pueden crear usuarios' });
          }
        } catch (error) {
          return res.status(403).json({ message: 'Token inválido' });
        }
      } else {
        if (pin !== process.env.INVITE_PIN) {
          return res.status(403).json({ message: 'PIN de invitación inválido' });
        }
      }
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userCount === 0 ? 'admin' : (role || 'colaboradorB')
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    await user.update({ lastLogin: new Date() });

    const token = generateToken(user);

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      notifications: req.user.notifications
    }
  });
};

const updateProfile = async (req, res) => {
  try {
    const { name, notifications } = req.body;
    
    await req.user.update({
      name: name || req.user.name,
      notifications: notifications !== undefined ? notifications : req.user.notifications
    });

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        notifications: req.user.notifications
      }
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const logout = async (req, res) => {
  res.json({ message: 'Logout exitoso' });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout
};