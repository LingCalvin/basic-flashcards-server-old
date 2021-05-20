import { AuthGuard } from '@nestjs/passport';

const OptionalJwtAuthGuard = AuthGuard(['jwt', 'anonymous']);

export default OptionalJwtAuthGuard;
