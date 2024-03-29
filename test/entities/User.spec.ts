import expect from 'expect';
import User, { currentTimestamp } from '../../src/entities/User';

describe('user entity tests', () => {
  it('can create an instance of the User entity', () => {
    const username = 'fake-username';
    const displayName = 'fake-display-name';
    const bio = 'fake-bio';
    const birthDate = '1991-12-16';
    const user = new User(username, displayName, bio, birthDate);
    expect(user.username).toBe(username);
    expect(user.displayName).toBe(displayName);
    expect(user.bio).toBe(bio);
    expect(user.birthDate).toBe(birthDate);
  });

  it('should return CURRENT_TIMESTAMP', () => {
    expect(currentTimestamp()).toBe('CURRENT_TIMESTAMP');
  });
});
