import mongosse from 'mongoose';

const connectDB = async () => {
    try {
        mongosse.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err.message);
        }
        );
        mongosse.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        }
        );
        await mongosse.connect(process.env.MONGO_URI,);
        
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
    };
export default connectDB;